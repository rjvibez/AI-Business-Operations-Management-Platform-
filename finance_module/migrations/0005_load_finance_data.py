import csv
import logging
from pathlib import Path
from django.db import migrations

logger = logging.getLogger(__name__)


def clean_priority(raw):
    v = str(raw or '').strip().capitalize()
    return v if v in ['High', 'Medium', 'Low'] else 'Medium'


def load_finance_dataset(apps, schema_editor):
    Expense = apps.get_model('finance_module', 'Expense')
    Budget = apps.get_model('finance_module', 'Budget')
    Invoice = apps.get_model('finance_module', 'Invoice')

    # If records already present, skip loading to avoid duplicates
    existing_count = Expense.objects.count()
    if existing_count >= 1000:
        logger.info(f"Finance records already loaded ({existing_count} records). Skipping.")
        return

    # Look for Finance data.csv in common relative locations
    possible_paths = [
        Path(__file__).resolve().parents[2] / 'datasets' / 'Finance data.csv',
        Path(__file__).resolve().parents[3] / 'datasets' / 'Finance data.csv',
        Path.cwd() / 'datasets' / 'Finance data.csv',
        Path.cwd().parent / 'datasets' / 'Finance data.csv',
    ]

    csv_path = None
    for p in possible_paths:
        if p.exists():
            csv_path = p
            break

    if not csv_path:
        logger.warning("Could not find 'Finance data.csv'. Data migration skipped.")
        return

    expense_objs = []
    budget_map = {}
    invoice_objs = []

    with open(csv_path, mode='r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        for count, row in enumerate(reader):
            if count >= 1000:
                break

            eid = (row.get('expense_id') or f"EXP{count+1:04d}").strip()
            dept = (row.get('department') or 'General').strip()[:100]
            cat = (row.get('category') or 'General').strip()[:100]
            prio = clean_priority(row.get('expense_priority') or row.get('priority'))
            vendor = (row.get('vendor_name') or 'Unknown')[:200]
            method = (row.get('payment_method') or 'Cash')[:50]
            status = (row.get('approval_status') or 'Pending')[:20]
            raw_date = (row.get('expense_date') or '2024-01-01')[:10]

            try:
                amt = float(row.get('amount') or 0)
            except Exception:
                amt = 0.0

            try:
                used = float(row.get('budget_used') or amt or 0)
            except Exception:
                used = amt

            try:
                alloc = float(row.get('budget_allocated') or 0)
            except Exception:
                alloc = 0.0

            if alloc <= 0:
                alloc = amt or (used * 1.5 if used else 100000.0)

            expense_objs.append(
                Expense(
                    expense_id=eid,
                    department=dept,
                    category=cat,
                    amount=amt,
                    budget_used=used,
                    budget_allocated=alloc,
                    budget_limit=alloc,
                    vendor_name=vendor,
                    payment_method=method,
                    expense_date=raw_date,
                    expense_priority=prio,
                    approval_status=status,
                )
            )

            # Accumulate budget
            bkey = (dept, cat)
            if bkey not in budget_map:
                budget_map[bkey] = {'limit': alloc, 'used': used, 'prio': prio}
            else:
                budget_map[bkey]['used'] += used
                if alloc > budget_map[bkey]['limit']:
                    budget_map[bkey]['limit'] = alloc

            # Generate Invoice
            inv_num = f"INV-{eid}"
            inv_status = 'Paid' if status.lower() == 'approved' else 'pending'
            invoice_objs.append(
                Invoice(
                    invoice_number=inv_num,
                    department=dept,
                    vendor_name=vendor,
                    vendor=vendor,
                    amount=amt or used,
                    status=inv_status,
                    expense_date=raw_date,
                    payment_method=method,
                )
            )

    if expense_objs:
        Expense.objects.bulk_create(expense_objs, ignore_conflicts=True)

    if Invoice.objects.count() == 0 and invoice_objs:
        Invoice.objects.bulk_create(invoice_objs, ignore_conflicts=True)

    if Budget.objects.count() == 0 and budget_map:
        b_objs = [
            Budget(
                department=dept,
                category=cat,
                limit_amount=info['limit'],
                used_amount=round(info['used'], 2),
                period='2026-Q1',
                source='csv',
            )
            for (dept, cat), info in budget_map.items()
        ]
        Budget.objects.bulk_create(b_objs, ignore_conflicts=True)


def unload_finance_dataset(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('finance_module', '0004_alter_expense_options_invoice_expense_date_and_more'),
    ]

    operations = [
        migrations.RunPython(load_finance_dataset, reverse_code=unload_finance_dataset),
    ]
