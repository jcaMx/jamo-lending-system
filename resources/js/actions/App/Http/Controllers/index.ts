import DashboardController from './DashboardController'
import BorrowerController from './BorrowerController'
import LoanController from './LoanController'
import DailyCollectionController from './DailyCollectionController'
import RepaymentController from './RepaymentController'
import Reports from './Reports'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
BorrowerController: Object.assign(BorrowerController, BorrowerController),
LoanController: Object.assign(LoanController, LoanController),
DailyCollectionController: Object.assign(DailyCollectionController, DailyCollectionController),
RepaymentController: Object.assign(RepaymentController, RepaymentController),
Reports: Object.assign(Reports, Reports),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers