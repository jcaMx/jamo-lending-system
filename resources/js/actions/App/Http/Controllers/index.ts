import BorrowerController from './BorrowerController'
import DailyCollectionController from './DailyCollectionController'
import RepaymentController from './RepaymentController'
import Reports from './Reports'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    BorrowerController: Object.assign(BorrowerController, BorrowerController),
DailyCollectionController: Object.assign(DailyCollectionController, DailyCollectionController),
RepaymentController: Object.assign(RepaymentController, RepaymentController),
Reports: Object.assign(Reports, Reports),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers