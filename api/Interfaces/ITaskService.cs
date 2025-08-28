using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Task;
using api.Helpers;

namespace api.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<GetTaskDto>> GetAllTasksAsync(string username, QueryObject queryObject);
        Task<GetTaskDto?> GetTaskByIdAsync(int id, string username);
        Task<GetTaskDto> CreateTaskAsync(CreateTaskDto task, string username);
        Task<GetTaskDto> UpdateTaskAsync(int id, UpdateTaskDto task, string username);
        Task<bool> DeleteTaskAsync(int id, string username);
        Task<bool> TaskExistsAsync(int id, string username);
        Task<IEnumerable<GetTaskDto>> GetPastDueTasks(string userId);
        Task<IEnumerable<GetTaskDto>> GetUpcommingTasks(string userId);
    }
}