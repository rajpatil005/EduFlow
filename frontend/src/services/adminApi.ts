export const adminApi = {
    getDepartments : () => JSON.parse(localStorage.getItem('admin_departments') || '[]'),
    saveDepartments :(data : any[]) => localStorage.setItem('admin_departments', JSON.stringify(data)),

    getProgrammes : () => JSON.parse(localStorage.getItem('admin_programmes') || '[]'),
    saveProgrammes :(data : any[]) => localStorage.setItem('admin_programmes', JSON.stringify(data)),

    getYears : () => JSON.parse(localStorage.getItem('admin_years') || '[]'),
    saveYears :(data : any[]) => localStorage.setItem('admin_years', JSON.stringify(data)),

    getSemesters : () => JSON.parse(localStorage.getItem('admin_semesters') || '[]'),
    saveSemesters :(data : any[]) => localStorage.setItem('admin_semesters', JSON.stringify(data)),

    getDivisions : () => JSON.parse(localStorage.getItem('admin_divisions') || '[]'),   
    saveDivisions :(data : any[]) => localStorage.setItem('admin_divisions', JSON.stringify(data)),

    getSubjects : () => JSON.parse(localStorage.getItem('admin_subjects') || '[]'),
    saveSubjects :(data : any[]) => localStorage.setItem('admin_subjects', JSON.stringify(data)),


    // for create the new user
    getUsers: () => JSON.parse(localStorage.getItem('admin_users') || '[]'),
    saveUsers: (data: any[]) => localStorage.setItem('admin_users', JSON.stringify(data)),

  // for checking Audit Logs
  getAuditLogs: () => JSON.parse(localStorage.getItem('admin_audit_logs') || '[]'),
  addAuditLog: (action: string, entity: string, user: string = 'Admin') => {
    const logs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    const newLog = {
      id: Date.now().toString(),
      user,
      action,    
      entity,   
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('admin_audit_logs', JSON.stringify([newLog, ...logs]));
  }

};