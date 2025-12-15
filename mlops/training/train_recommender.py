"""
Minimal training skeleton for a recommendation model.

Ý tưởng:
- Load dữ liệu lịch sử đọc từ DB/export CSV.
- Tạo ma trận user-item và train collaborative filtering / matrix factorization.
- Log metrics + model artifact lên MLflow (nếu có).
"""

import argparse
from pathlib import Path


def load_data(data_path: Path):
    # TODO: đọc file CSV export từ PostgreSQL/MongoDB
    # Format gợi ý: user_id, isbn, rating, timestamp
    print(f"[TRAIN] Loading data from {data_path}")
    return []


def train_model(events):
    # TODO: triển khai model thực tế (surprise, implicit, lightfm, ...)
    print(f"[TRAIN] Training model with {len(events)} events (mock)")
    model = {"version": "0.0.1", "algo": "mock-collaborative-filtering"}
    return model


def save_model(model, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    out_file = output_dir / "model-metadata.json"
    out_file.write_text(str(model))
    print(f"[TRAIN] Saved model metadata to {out_file}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data-path",
        type=Path,
        default=Path("data/reading_events.csv"),
        help="CSV chứa lịch sử đọc / rating",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("artifacts"),
        help="Thư mục lưu model",
    )
    args = parser.parse_args()

    events = load_data(args.data_path)
    model = train_model(events)
    save_model(model, args.output_dir)


if __name__ == "__main__":
    main()


