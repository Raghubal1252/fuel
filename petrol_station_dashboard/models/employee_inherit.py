from odoo import api, fields, models, _


class EmployeeShift(models.Model):
    _name = 'employee.shift'
    _description = 'Employee Shift'

    name = fields.Char(string='Name')
    start_time = fields.Float(string='Start Time')
    end_time = fields.Float(string='End Time')
    shift_duration = fields.Float(string='Shift Duration')


class IndentVehicleList(models.Model):
    _name = 'indent.vehicle'
    _description = 'Indent Vehicle List'

    name = fields.Char(string='Vehicle No')
    customer_id = fields.Many2one(
        'res.partner', string='Customer', domain=[('customer_rank', '>', 0)]
    )


class HrEmployeePrivate(models.Model):
    _inherit = "hr.employee"

    shift_id = fields.Many2one('employee.shift', string='Shift')

    def emp_data(self, emp_ids):
        print("empId------------------------", emp_ids)

        if isinstance(emp_ids, (int, str)):  
            emp_ids = [int(emp_ids)]
        elif isinstance(emp_ids, list):
            emp_ids = [int(i) for i in emp_ids]  

        employees = self.env["hr.employee"].search([("id", "in", emp_ids)])
        last_records = {}

        for emp in employees:
            print("---------name----------", emp.name)
            last_shift = self.env["employee.shift.manage"].search(
                [("employee_id", "=", emp.id)],  
                order="id DESC", 
                limit=1 
            )
            print("-------------",last_shift)
            if last_shift:
                last_shift.write({"check_closing": False})
                last_records[emp.id] = {
                    "employee_name": emp.name,
                    "shift_id": last_shift.shift_id.id if last_shift.shift_id else None,
                    "check_closing": last_shift.check_closing,
                }

        print("=======Last Shift Record ==========", last_records)




class Contract(models.Model):
    _inherit = 'hr.contract'

    onhand_amount = fields.Float(string='On-Hand Amount')
    available_onhand_amount = fields.Float(string='Available On-Hand Amount')
    petty_cash_received = fields.Boolean(string='Petty Cash Received')
    petty_cash_last = fields.Float(string='Petty Cash Last')


class Company(models.Model):
    _inherit = "res.company"

    title = fields.Char(string="Title")
