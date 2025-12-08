/**
 * EXAMPLE: How to add RoleSwitcher to StudentLayout.tsx
 * 
 * Step 1: Add import at the top of the file
 * ============================================
 * import RoleSwitcher from '../RoleSwitcher';
 * 
 * 
 * Step 2: Add RoleSwitcher to header
 * ===================================
 * 
 * BEFORE:
 * -------
 * <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center">
 *   <input
 *     type="text"
 *     placeholder="Tìm kiếm hoạt động, CLB"
 *     className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none md:w-72"
 *   />
 * </div>
 * 
 * 
 * AFTER:
 * ------
 * <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center">
 *   <input
 *     type="text"
 *     placeholder="Tìm kiếm hoạt động, CLB"
 *     className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none md:w-72"
 *   />
 *   <RoleSwitcher />
 * </div>
 * 
 * 
 * The RoleSwitcher component will automatically hide if the user has only one role.
 * Apply the same pattern to LeaderLayout.tsx
 */

export {};
