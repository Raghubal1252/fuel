/** @odoo-module **/
console.log('*********************************************************888')
import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { _t } from "@web/core/l10n/translation";
import { Component } from "@odoo/owl";
import { onWillStart, onMounted, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
const actionRegistry = registry.category("actions");

export class FuelNozzleDashboard extends Component{
    setup() {
            super.setup(...arguments);
            this.orm = useService('orm');
            this.action = useService('action');
            this.actionService = useService("action");
            this.state = useState({
                data : [],
                employees :[],
                payment_mode: [],
                selected_employees_list :[],
                leads : [],
                selected_lead_list:[],
                opps : [],
                selected_opps_list:[],
                date_range: null,
                from_to : {},
                entry_type_value: "false"
            });
            this.load_data();
            onWillStart(this.onWillStart);
    }

    async onWillStart() {
        return this.load_data();
    }
    async load_data() {
        var self = this;
        try{
            var data =await self.orm.call("petrol.station.pump", "fetch_data", [[]]);
            self.state.data = data['data']
            self.state.title = data['title']
            self.state.emp_data = data['emp_data']
            this.state.payment_mode = data['payment_mode']
            // var emp_data = await self.orm.call("hr.employee","emp_data",[[]]);
            // console.log("-----emp_data-----",emp_data);

        } catch (el) {
            window.location.href;
        }
    }

    async open_wizard(){
        event.preventDefault();
        const updateButton = event.currentTarget;
        const currentForm = updateButton.closest(".entry_form")
        const entryType = updateButton.getAttribute("type");
        const pettyStatus = updateButton.getAttribute("petty_cash_status");
        const empId = updateButton.getAttribute("emp_id");
        const id = updateButton.getAttribute("ids");
        const pettyCash = document.getElementById("petty_cash_amount");
        const petty_cash_new = updateButton.getAttribute('petty_cash_new');
        const nozzleBlock = document.getElementById("popup_details_nozzle");
        const truckBlock = document.getElementById("popup_details_truck");
        const pumpsNo = document.getElementById("pump_sno");
        const startReading = document.getElementById("start_reading");
        const endReading = document.getElementById("end_reading");
        const fuelName = document.getElementById("fuel_name");
        const cumSale = document.getElementById("cum_sale");
        const vehicleName = document.getElementById("vehicle_name");
        const startKm = document.getElementById("start_km");

        const truckTrigger = document.getElementById("pause_truck_function");
        truckTrigger.setAttribute('ids', id);
        truckTrigger.setAttribute('emp_id', empId);
        truckTrigger.setAttribute('aa', entryType);
        const nozzleTrigger = document.getElementById("pause_nozzle_function");
        nozzleTrigger.setAttribute('ids', id);
        nozzleTrigger.setAttribute('emp_id', empId);
        nozzleTrigger.setAttribute('aa', entryType);

        this.state.entry_type_value = entryType;

        if (entryType == "nozzle"){
            const startReading1 = currentForm.querySelector("[name='start_reading_1']")?.value || "false";
            const endTime = currentForm.querySelector("[name='end_time']")?.value || "false";
            const endReading1 = currentForm.querySelector("[name='end_reading_1']")?.value || "false";
            const stReading = updateButton.getAttribute("e_read");
            startReading.setAttribute('value', stReading);
            fuelName.setAttribute('value', updateButton.getAttribute("fuel_id"));
            if (endTime == 'false' && Number(endReading1) == 0.00){
                nozzleBlock.style.display = "block";
                pumpsNo.setAttribute('value', updateButton.getAttribute("s_no"));
                console.log('****************************', pettyStatus, pettyCash, id)
                if (pettyStatus == 'true'){
                    pettyCash.setAttribute('readonly', "1");
                    pettyCash.setAttribute('value', Number(petty_cash_new));
                }
//                else{
//                    pettyCash.setAttribute('required', "1");
//                    pettyCash.setAttribute('value', false);
//                }
            }
            else if (endTime == 'false' && Number(endReading1) >= 0.00){
                alert("Please Enter the End Time!");
            }
            else if (endTime != 'false' && Number(endReading1) == 0.00){
                alert("Please Enter the End Reading!");
            }
            else if (endTime != 'false' && Number(endReading1) <= Number(stReading)){
                alert("End Reading must be greater than Start Reading");
            }
            else {
                nozzleBlock.style.display = "block";
                pumpsNo.setAttribute('value', updateButton.getAttribute("s_no"));
//                pettyCash.setAttribute('readonly', "1");
//                pettyCash.setAttribute('value', Number(petty_cash_new));
                this._onchange_end_time(id, endTime, endReading1)
                endReading.setAttribute('value', endReading1);
                const final = endReading1 - startReading.getAttribute('value');
                cumSale.setAttribute('value', final.toFixed(3));
            }
        }
        if (entryType == 'truck'){
            truckBlock.style.display = "block";
            truckTrigger.setAttribute('ids', id);
            vehicleName.setAttribute('value', updateButton.getAttribute('fleet'));
            startKm.setAttribute('value', updateButton.getAttribute('start_km'));
        }

    }


    async pause_truck_function(){
        const pauseButtonTruck = event.currentTarget;
        var id = pauseButtonTruck.getAttribute('ids');
        var array = []
            var beta = {}
            var food = {}
            var maintenance = {}
            var loading = {}
            var rto = {}
            var commission = {}
            var amount = document.getElementById("total_amount")?.value
            var start_km = document.getElementById("start_km")?.value
            var end_km = document.getElementById("end_km")?.value
            beta['beta'] = document.getElementById("beta_expense")?.value
            food['food'] = document.getElementById("food_expense")?.value
            maintenance['maintenance'] = document.getElementById("maintenance_service")?.value
            loading['loading'] = document.getElementById("loading_expense")?.value
            rto['rto'] = document.getElementById("rto_expense")?.value
            commission['commission'] = document.getElementById("commission_expense")?.value
            array.push(beta)
            array.push(food)
            array.push(maintenance)
            array.push(loading)
            array.push(rto)
            array.push(commission)
            if (Number(amount) <= 0.00){
                alert("Total amount must be greater than zero!");
            }
            if(Number(end_km) <= start_km){
                alert("End KM must be grater than Start KM!");
            }
            else{
                var val_fuel =await this.orm.call("petrol.station.pump", "rental_truck_invoice", [[], id, array, amount, start_km, end_km]);
                var block = document.getElementById("popup_details_truck");
                block.style.display = "none";
                window.location.reload()
            }
    }

    async pause_nozzle_function() {
        const pauseButton = event.currentTarget;
        const entryType = pauseButton.getAttribute("aa");
        const currentFormEntry = pauseButton.closest(".form_entry_details")

        var self = this;
        var dict = {}
        var id = pauseButton.getAttribute('ids');

        
        // const paymentModeSelect = document.getElementById("payment_mode");
        // const selectedPaymentMode = paymentModeSelect ? paymentModeSelect.value : null;
        // console.log("---------",selectedPaymentMode);
        // dict['payment_mode'] = selectedPaymentMode;

        if (entryType == 'nozzle'){
            const advanceAmount = document.getElementById('advance_amount')?.value;
            if (advanceAmount == false || advanceAmount == 0.00){
                alert("Please Enter the Advance Amount!");
            }
            else{
                var petty_amount = document.getElementById('petty_cash_amount')?.value;
                dict['pump_sno'] = document.getElementById('pump_sno')?.value;
                dict['start_reading'] = document.getElementById('start_reading')?.value;
                dict['end_reading'] = document.getElementById('end_reading')?.value;
                dict['cum_sale'] = document.getElementById('cum_sale')?.value;
                dict['advance_amount'] = document.getElementById('advance_amount')?.value;
                console.log("==============",dict['advance_amount']);
                const paymentModeSelect = document.getElementById("payment_mode");
                const selectedPaymentMode = paymentModeSelect ? paymentModeSelect.value : null;
                console.log("++++++++++++",selectedPaymentMode);
                dict['payment_mode'] = selectedPaymentMode;
                var employee = pauseButton.getAttribute('emp_id')
                dict['id'] = id
                dict['emp_id'] = employee
                if (pauseButton.getAttribute('sub_emp_id') == false){
                    dict['sub_id'] = false
                    dict['sub_emp_id'] = false
                }
//                else{
//                    subId = document.getElementById("sub_id")
//                    dict['sub_id'] = subId.value
//                    dict['sub_emp_id'] = pauseButton.getAttribute('sub_emp_id')
//                }
                await this.orm.call("petrol.station.pump.line", "create_record", [[], dict]);
                var petty_cash_amt = petty_amount
                var petty_status = pauseButton.getAttribute('petty_status')
                if (petty_cash_amt > Number(0.00) && petty_status != 'true'){
                    await this.orm.call("petrol.station.pump", "create_journal_entry", [[], id, petty_cash_amt, employee]);
                    await this.orm.call("petrol.station.pump", "update_petty_cash", [[], id, petty_amount]);
                }
                if ((document.getElementById('end_reading')?.value != false) && Number(document.getElementById('end_reading')?.value) > Number(document.getElementById('start_reading')?.value)){
                    this._onchange_close_statement(id)
                }
                var block = document.getElementById("popup_details_nozzle");
                block.style.display = "block";
                window.location.reload()
            }
        }
    }
    async pump_data_function() {
        var self = this;
        var pauseButton = event.currentTarget;
        var id =pauseButton.getAttribute("ids");
        var en_type =pauseButton.getAttribute("type");
        event.preventDefault();
        const button = event.currentTarget;
        
        const empId = button.dataset.empId;
        var emp_id = empId;
        console.log("-----emp_id---",empId)
        try {

            await this.orm.call("hr.employee", "emp_data", [[], emp_id]);
        } catch (error) {
            console.error("Error calling emp_data:", error);
        }

        this.actionService.doAction({
            name: _t("Pump Line Datas"),
            type: 'ir.actions.act_window',
            res_model: 'petrol.station.pump.line',
            view_mode: 'tree,form',
            view_type: 'form',
            views: [[false, 'list'],[false, 'form']],
            domain: [['petrol_pump', '=', Number(id)],['quotation_create','=', false]],
            target: 'current'
        })
        if (en_type == 'tank'){
            this.actionService.doAction({
                name: _t('Bouch Details'),
                type: 'ir.actions.act_window',
                res_model: 'bouches.entry.details',
                context:{'default_bouche_id':Number(id)},
                target: 'current',
                views: [[false, 'form']],
            });
        }
    }
    async _onchange_end_time(id, end_time, end_reading) {
        await this.orm.call("petrol.station.pump", "update_end_time", [[], end_time, end_reading, id]);
    }

    async _onchange_close_statement(id) {
        await this.orm.call("petrol.station.pump", "update_close_statement", [[], id]);
    }

    async refresh_back(){
        window.location.reload();
    }

    async calculate_total_km() {
        var start = document.getElementById("start_km")?.value
        var end = document.getElementById("end_km")?.value
        var total = document.getElementById("total_km")
        if (Number(start) >= Number(end)){
            alert("Ending KM must be Greater than Staring KM!");
        }
        else{
            const final = end - start
            total.setAttribute('value', final);
        }
    }

}
FuelNozzleDashboard.template = 'FuelNozzleDashboard'
registry.category("actions").add("pump_dashboard", FuelNozzleDashboard)
