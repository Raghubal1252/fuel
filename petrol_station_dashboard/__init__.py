def create_account_petty(env):
   env['account.account'].create({
       'code': '101100',
       'name': 'Petty Cash',
       'account_type': 'asset_cash',
   })

from . import models
from . import wizard
