using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Helpers;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDBContext _context;

        public TaskRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Models.Task>> GetAllTasksAsync(string userId, QueryObject queryObject)
        {
            var query = _context.Tasks
                .Include(c => c.Notes)
                .Where(t => t.UserId == userId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryObject.Title))
            {
                query = query.Where(t => t.Title.Contains(queryObject.Title));
            }

            if (queryObject.IsCompleted.HasValue)
            {
                query = query.Where(t => t.IsCompleted == queryObject.IsCompleted.Value);
            }

            if (queryObject.From.HasValue)
            {
                query = query.Where(t => t.DueDate >= queryObject.From.Value);
            }

            if (queryObject.To.HasValue)
            {
                query = query.Where(t => t.DueDate <= queryObject.To.Value);
            }

            return await query.ToListAsync();
        }


        public async Task<Models.Task?> GetTaskByIdAsync(int id, string userId)
        {
            return await _context.Tasks
                .Include(c => c.Notes)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<Models.Task> CreateTaskAsync(Models.Task task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<Models.Task> UpdateTaskAsync(Models.Task task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> DeleteTaskAsync(int id, string userId)
        {
            var task = await GetTaskByIdAsync(id, userId);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> TaskExistsAsync(int id, string userId)
        {
            return await _context.Tasks.AnyAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<IEnumerable<Models.Task>> GetUpcomingTasksAsync(string userId)
        {
            var startOfNextWeek = DateTime.Today.AddDays(7 - (int)DateTime.Today.DayOfWeek);
            var endOfNextWeek = startOfNextWeek.AddDays(6);

            return await _context.Tasks
                .Include(c => c.Notes)
                .Where(t => t.UserId == userId)
                .Where(t => t.DueDate >= startOfNextWeek && t.DueDate <= endOfNextWeek)
                .Where(t => t.IsCompleted == false)
                .ToListAsync();
        }

        public async Task<IEnumerable<Models.Task>> GetPastDueTasksAsync(string userId)
        {
            var startOfPreviousWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek - 7);
            var endOfPreviousWeek = startOfPreviousWeek.AddDays(6);

            return await _context.Tasks
                .Include(c => c.Notes)
                .Where(t => t.UserId == userId)
                .Where(t => t.DueDate >= startOfPreviousWeek && t.DueDate <= endOfPreviousWeek)
                .Where(t => t.IsCompleted == false)
                .ToListAsync();
        }
    }

}