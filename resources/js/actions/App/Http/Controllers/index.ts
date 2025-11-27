import DashboardController from './DashboardController'
import BorrowerController from './BorrowerController'
import LoanController from './LoanController'
import DailyCollectionController from './DailyCollectionController'
import RepaymentController from './RepaymentController'
import Reports from './Reports'
import UserController from './UserController'
import ApplicationController from './ApplicationController'
import Settings from './Settings'
const Controllers = {
<<<<<<< HEAD
    DashboardController: Object.assign(DashboardController, DashboardController),
BorrowerController: Object.assign(BorrowerController, BorrowerController),
=======
    BorrowerController: Object.assign(BorrowerController, BorrowerController),
>>>>>>> f527e644e77be1939726e62492d52074749b459a
LoanController: Object.assign(LoanController, LoanController),
DailyCollectionController: Object.assign(DailyCollectionController, DailyCollectionController),
RepaymentController: Object.assign(RepaymentController, RepaymentController),
Reports: Object.assign(Reports, Reports),
UserController: Object.assign(UserController, UserController),
ApplicationController: Object.assign(ApplicationController, ApplicationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers