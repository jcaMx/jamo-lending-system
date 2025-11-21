import BorrowerController from './BorrowerController'
import CollectionSheetController from './CollectionSheetController'
import RepaymentController from './RepaymentController'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    BorrowerController: Object.assign(BorrowerController, BorrowerController),
CollectionSheetController: Object.assign(CollectionSheetController, CollectionSheetController),
RepaymentController: Object.assign(RepaymentController, RepaymentController),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers