import logging
from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

logger = logging.getLogger(__name__)

MODEL_PATH = Path(__file__).resolve().parents[2] / 'models' / 'task_completion_model.pkl'

PRIORITY_MAP = {
    'Low': 0,
    'Medium': 1,
    'High': 2,
    'Critical': 3,
}

FEATURES = [
    'estimated_hours',
    'experience_years',
    'allocation_score',
    'workload_percentage',
    'performance_score',
    'active_tasks',
    'task_priority_enc',
    'duration_days',
]


@lru_cache(maxsize=1)
def load_task_model(model_path=MODEL_PATH):
    path = Path(model_path)
    if not path.exists():
        raise FileNotFoundError(f'Task completion model not found at {path}.')
    logger.info('Loading task completion model from %s', path)
    return joblib.load(path)


def predict_completion_hours(task_info: dict, model=None) -> float:
    trained_model = model or load_task_model()

    priority_val = task_info.get('task_priority', 'Medium')
    if isinstance(priority_val, str):
        priority_enc = PRIORITY_MAP.get(priority_val.strip().capitalize(), 1)
    else:
        priority_enc = int(priority_val)

    row = {
        'estimated_hours': float(task_info.get('estimated_hours', 10.0)),
        'experience_years': float(task_info.get('experience_years', 5.0)),
        'allocation_score': float(task_info.get('allocation_score', 80.0)),
        'workload_percentage': float(task_info.get('workload_percentage', 50.0)),
        'performance_score': float(task_info.get('performance_score', 85.0)),
        'active_tasks': int(task_info.get('active_tasks', 2)),
        'task_priority_enc': priority_enc,
        'duration_days': float(task_info.get('duration_days', 14.0)),
    }

    input_df = pd.DataFrame([row])[FEATURES]
    predicted = trained_model.predict(input_df)[0]
    return round(float(predicted), 2)
