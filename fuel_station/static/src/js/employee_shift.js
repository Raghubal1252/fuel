/** @odoo-module **/

import { Component, useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class EmployeeShiftDashbord extends Component {
    setup() {
        this.orm = useService("orm");
        this.data = useState({
            employees: [],
            shift_types: [],
            pumps_types: [], 
            created_shift: [],
            parent_pumps: [],
            filtred_employees:[],
            filtres_nozzel:[],
        });

        onMounted(() => {
            var data = {}
            this.title = 'Dashboard'
            this.fetchemployees();
        });
    }

    async fetchemployees(){
        console.log("----------fetching employees----------");
        const result = await this.orm.call("hr.employee", "employees_shif_manager", [[], this.data.employees]);
        console.log("Employee Skills Data:", result);
        this.data.employees = result.employees;
        console.log("----this.data.employees----",this.data.employees)
        this.data.shift_types = result.shift_types;
        console.log("----this.data.shift_types----",this.data.shift_types)
        this.data.pumps_types = result.pumps_types;
        console.log("----this.data.pumps_types----",this.data.pumps_types)
        this.data.created_shift = result.created_shift;
        this.data.parent_pumps = result.parent_pumps;
        console.log("-----this.data.parent_pumps-----",this.data.parent_pumps);
    }

    // async fetchParent(ev) {
    //     const selectedParentId = parseInt(ev.target.value);
    //     console.log("selected parent",selectedParentId);

    //     this.data.filtres_nozzel = this.data.pumps_types.filter(
    //         pump => pump.parent_id === selectedParentId
    //     );
    //     console.log("-----this.data.filtres_nozzel-----",this.data.filtres_nozzel);

    // }

    async fetchParent(ev) {
        const selectedParentId = parseInt(ev.target.value);
        const employeeId = parseInt(ev.target.closest(".employee-row").dataset.employeeId);
        
        console.log("Selected Parent:", selectedParentId, "for Employee:", employeeId);
    
        this.data.employees = this.data.employees.map(employee => {
            if (employee.id === employeeId) {
                return {
                    ...employee,
                    filtres_nozzel: this.data.pumps_types.filter(pump => pump.parent_id === selectedParentId),
                };
            }
            return employee;
        });
    
        console.log("Updated Employees with Nozzles:", this.data.employees);
    }
    


    async filterEmployees(ev) {
        const selectedEmployeeId = parseInt(ev.target.value);
        console.log("Selected Employee ID:", selectedEmployeeId);
    
        if (!selectedEmployeeId) {
            await this.fetchemployees();
            return;
        }
    
        this.data.filteredEmployees = this.data.employees.filter(
            employee => employee.id === selectedEmployeeId
        );
    
        console.log("Filtered Employees:", this.data.filteredEmployees);
    }
    
    
    
    

    async updatemployees() {
        console.log("Apply button clicked!");
    
        const employeeRows = document.querySelectorAll(".employee-row"); 
        let updatePromises = []; 
    
        employeeRows.forEach((row, index) => {
            const employeeId = row.dataset.employeeId;
            const shiftDropdown = row.querySelector(".shift-select");
            const pumpDropdown = row.querySelector(".pump-select");
    
            const selectedShiftId = shiftDropdown?.value || "Not Selected";
            const selectedPumpId = pumpDropdown?.value || "Not Selected";
    
            console.log(`Employee ${employeeId}: Shift ID - ${selectedShiftId}, Pump ID - ${selectedPumpId}`);
            
            if (employeeId && selectedShiftId !== "Not Selected" && selectedPumpId !== "Not Selected") {
                updatePromises.push(
                    this.orm.call("hr.employee", "update_employee_shift", [
                        parseInt(employeeId), 
                        parseInt(selectedShiftId),  
                        parseInt(selectedPumpId)
                    ])
                );
            }
        });
    
        try {
            const results = await Promise.all(updatePromises);
            console.log("===============", results);
        } catch (error) {
            console.error("Error updating employee shifts:", error);
        }
    }
    
    
    



}

EmployeeShiftDashbord.template = "emploayee_shift_maintainenece";
registry.category("actions").add("employee_shift_master", EmployeeShiftDashbord);
