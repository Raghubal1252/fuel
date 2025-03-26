from odoo import api, fields, models, _
from odoo.fields import Command

class ShiftMaster(models.Model):
    _name = "shift.master"

    
    name = fields.Char(string="Shift")
    work_schedule = fields.Many2one('resource.calendar',string="Work Schedule") 
    

