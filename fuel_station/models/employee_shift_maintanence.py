from odoo import api, fields, models, _
from odoo.fields import Command

class HrEmployeeShiftManage(models.Model):
    _inherit = "hr.employee"

    employee_shift_ids = fields.One2many('employee.shift.manage', 'employee_id')
    shifts_id = fields.Many2one('shift.master',string="Shift")

    def employees_shif_manager(self, employees=None):
        cr = self.env.cr
        cr.execute("SELECT id, name FROM hr_employee")
        all_employees = {row[0]: {"id": row[0], "name": row[1]} for row in cr.fetchall()}
        
        print("+++++++++++++++++++",all)

        selected_employees = employees or all_employees.keys()

        print("----------------------",selected_employees)

        employees = {
            emp_id: {"id": emp_id, "name": emp_data["name"]}
            for emp_id, emp_data in all_employees.items() if emp_id in selected_employees
        }
        print("===================",employees)


        cr.execute("""
            SELECT s.id, s.employee_id, s.shift_id, s.shift_start_date, s.shift_end_date,  s.pump_id
            FROM employee_shift_manage s
        """)
        all_created_records = {row[0]: {"id": row[0], "employee_id": row[1], "shift_id": row[2],"shift_start_date":row[3],
                               "shift_end_date":row[4], "pump_id":row[5]} for row in cr.fetchall()}
        print("=======all_created_records==========",all_created_records)

        cr.execute("""
                SELECT s.id, s.name, s.work_schedule
                   FROM shift_master s
        """)
        shift_types = {row[0]:{"id": row[0], "name": row[1], "work_schedule": row[2]} for row in cr.fetchall()}
        print("+++++++++++shift_types+++++++++",shift_types)

        cr.execute("""
                SELECT s.id, s.name
                   FROM resource_calendar s
        """)
        work_schedule = {row[0]:{"id": row[0], "name": row[1]} for row in cr.fetchall()}
        print("+++++++++++work Schudel+++++++++",work_schedule)


        cr.execute("""
                SELECT s.id, s.name, s.parent_id
                   FROM petrol_station_pump s
                   WHERE s.parent_id IS NOT NULL
                    AND s.pump_sale_type = 'nozzle'
        """)
        pumps = {row[0]:{"id": row[0], "name": row[1], "parent_id": row[2]} for row in cr.fetchall()}
        print("============pumps==========",pumps)
        
        cr.execute("""
                SELECT s.id, s.name
                   FROM petrol_station_pump s
                   WHERE s.parent_id IS NULL
                    AND s.pump_sale_type = 'nozzle'
        """)
        parent_pumps = {row[0]:{"id": row[0], "name": row[1]} for row in cr.fetchall()}
        print("+++++++++parent_pumps+++++++++++",parent_pumps)


        return {
            "employees": list(employees.values()),
            "created_shift":list(all_created_records.values()),
            "shift_types":list(shift_types.values()),
            "pumps_types":list(pumps.values()),
            "work_schedule":list(work_schedule.values()),
            "parent_pumps":list(parent_pumps.values())
        }
    

    def update_employee_shift(self,  shift_id, pump_id):
        print("------------", shift_id,"============",pump_id)
        print("employee id ",self.id)
        self.env["employee.shift.manage"].create({
                "employee_id": self.id,
                "shift_id": shift_id,
                "pump_id": pump_id,
            })
        self.write({'shifts_id': shift_id})

        pump = self.env["petrol.station.pump"].browse(pump_id)
        if pump.exists():
            pump.write({'employee_id': self.id, 'shifts_id':shift_id})
        print("created------------")
    


class EmployeeShiftManager(models.Model):
    _name = "employee.shift.manage"

    employee_id = fields.Many2one('hr.employee', string='Employee')
    shift_start_date = fields.Date(string="Shift Start Date")
    shift_end_date = fields.Date(string="Shift End Date")
    shift_id = fields.Many2one('shift.master', string="Shift Type")
    shift_work_schedule = fields.Many2one('resource.calendar', related="shift_id.work_schedule", 
        store=True, string="Work Schedule")
    pump_id = fields.Many2one('petrol.station.pump',string="Nozzle")


class PetrolStation(models.Model):
    _inherit = 'petrol.station.pump'
    _description = 'Petrol Station Pump'

    shifts_id = fields.Many2one('shift.master', string="Shift")
