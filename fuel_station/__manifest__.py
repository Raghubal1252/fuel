{
    'name': 'Fuel Station Employee managment',
    'version': '18.1',
    'category': 'Extra Tools',
    'website': 'www.appscomp.com',
    'author': 'AppsComp Widgets Pvt Ltd',
    'summary': 'The Fuel Station Employee managment module manages employees shift and the pump has assigned',
    'depends': ['base', 'purchase', 'sale', 'stock', 'hr', 'petrol_station_dashboard'],
    'data': [
        'security/ir.model.access.csv',
        'views/employee_shift_maintanence.xml',
        'views/shift_master.xml',
        'views/employee_shift_dashboard.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'fuel_station/static/src/js/employee_shift.js',
            'fuel_station/static/src/xml/employee_shift.xml',
        ],
    },
    'license': 'OPL-1',
    'installable': True,
    'auto_install': False,
    'application': False,
    # 'price': '150',
    #'price': '91.59',
    'currency': 'EUR',
}
