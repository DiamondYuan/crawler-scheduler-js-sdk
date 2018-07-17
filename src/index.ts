import * as request from 'request-promise-native';

export interface CrawlerTask {
    url: string,
    info?: CrawlerTaskInfo[],
    weight?: number,
   
}
export interface CrawlerTaskResult extends CrawlerTask{
    getInfo: (key: string) => string|null;
}

export interface CrawlerTaskInfo{
    key:string,
    value:string
}

export interface TaskResult {
    data: CrawlerTaskResult|null
}

export interface CommonResult {
    data: string
}

export interface taskScheduler {
    get(): Promise<CrawlerTaskResult|null>
    push(task: CrawlerTask):  Promise<Boolean>
    complete(task: CrawlerTask):  Promise<Boolean>
    clear(): Promise<Boolean>
}

function createScheduler(
    project: string,
    host: string
): taskScheduler {
    return {
        get: () => {
            return new Promise((resolve,reject)=>{
                request.get(`${host}/api/v1/tasks?project=${project}`,{ json: true })
                .then((rs:TaskResult)  => {
                    const task = rs.data
                    if(task){
                        task.getInfo = (key:string) => {
                            if(!task.info || task.info.length < 1){
                                return null
                            }
                            for(let i = 0;i<task.info.length;i++){
                                if(task.info[i].key === key){
                                    return task.info[i].value
                                }
                            }
                            return null
                        }
                    }
                    return resolve(task)
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        push: (task: CrawlerTask) => {
            if (!task.weight) {
                task.weight = 1
            }
            return new Promise((resolve,reject)=>{
                request.post(`${host}/api/v1/tasks?project=${project}`, {
                    body: JSON.stringify(task)
                }).then(_=>{resolve(true)}).catch(err=>{reject(err)})
            }) 
        },
        complete: (task: CrawlerTask) => {
            if (!task.weight) {
                task.weight = 1
            }
            return new Promise((resolve,reject)=>{
                request.post(`${host}/api/v1/tasks/complete?project=${project}`, {
                    body: JSON.stringify(task)
                }).then(_=>{resolve(true)}).catch(err=>{reject(err)})
            }) 
        },
        clear: () => {
            return new Promise((resolve,reject)=>{
                request.post(`${host}/api/v1/tasks/clear?project=${project}`)
                .then(_=>{resolve(true)}).catch(err=>{reject(err)})
            }) 
        }
    }
}
export {
    createScheduler
}