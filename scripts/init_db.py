from pathlib import Path
import sqlite3


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "prisma" / "dev.db"
MIGRATIONS_DIR = ROOT / "prisma" / "migrations"


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(DB_PATH) as connection:
        existing_tables = {
            row[0]
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            ).fetchall()
        }

        migration_paths = sorted(MIGRATIONS_DIR.glob("*/migration.sql"))

        for migration_path in migration_paths:
            if (
                migration_path.parent.name == "20260313000000_init_analysis_history"
                and "AnalysisRun" in existing_tables
            ):
                continue

            if (
                migration_path.parent.name == "20260313010000_fix_category"
                and "RecommendedFix" in existing_tables
            ):
                columns = {
                    row[1]
                    for row in connection.execute(
                        "PRAGMA table_info('RecommendedFix')"
                    ).fetchall()
                }
                if "category" in columns:
                    continue

            sql = migration_path.read_text()
            connection.executescript(sql)
        connection.commit()

    print(f"Initialized SQLite database at {DB_PATH}")


if __name__ == "__main__":
    main()
