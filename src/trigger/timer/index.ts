import schedule from 'node-schedule';

class TimerTrigger {
    // 储存Jobs
    private jobs: Map<string, schedule.Job> = new Map();

    // 新增Job
    scheduleJob(rule: string, callback: () => void) {
        const job = schedule.scheduleJob(rule, callback);
        this.jobs.set(job.name, job);
        return job.name;
    }

    // 取消Job
    cancelJob(name: string) {
        const job = this.jobs.get(name);
        if (job) {
            job.cancel();
            this.jobs.delete(name);
        }
    }
}

export default TimerTrigger;