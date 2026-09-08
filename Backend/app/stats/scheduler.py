from apscheduler.schedulers.asyncio import AsyncIOScheduler
from database import session_scope
from stats.statsService import StatsService
from users.models.user import User

scheduler = AsyncIOScheduler()

# Global StatsService instance
stats_service = StatsService()

async def generate_daily_stats():
    """Generate conversation stats for every user once per day."""
    with session_scope() as session:
        user_ids = [row.id for row in session.query(User.id).all()]

    for uid in user_ids:
        await stats_service.generate_stats(uid)

# Register the job: every day at midnight (00:00)
scheduler.add_job(generate_daily_stats, trigger="cron", hour=0, minute=0, id="daily_stats") 
