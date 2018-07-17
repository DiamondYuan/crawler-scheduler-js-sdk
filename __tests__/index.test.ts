import { createScheduler } from '../src/index'
const taskScaduler = createScheduler("test", "http://127.0.0.1:4567")

test('test clear', async () => {
   const clearResult = await taskScaduler.clear()
   expect(clearResult).toBe(true)   
  });

test('test api', async () => {
   const postTask = {
    url:"http://www.qq.com",
    info:[{key:"key",value:"value"},{key:"key2",value:"value2"}],
    weight:7
   }
   const postResult = await taskScaduler.push(postTask)
   expect(postResult).toBe(true)
   const task = await taskScaduler.get()
   expect(task.url).toBe(postTask.url)
   expect(task.weight).toBe(postTask.weight)
   expect(task.info.length).toBe(postTask.info.length)
   expect(task.getInfo('key')).toBe('value')
   expect(task.getInfo('key2')).toBe('value2')
  });