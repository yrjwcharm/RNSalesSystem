import {createStackNavigator, createAppContainer} from "react-navigation";
import CardStackStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
import Login from './pages/Login';
import Main from './pages/Main';
import Splash from './pages/Splash'
import Register from "./pages/Register";
import TaskInfo from "./pages/following/TaskInfo";
import SaleChance from "./pages/following/SaleChance";

//跟进中
import FollowingMain from "./pages/following/Main";
import IntentionDetail from "./pages/following/IntentionDetail";
import FollowInfo from "./pages/following/FollowInfo";
import ContactInfo from "./pages/following/ContactInfo";
import AlreadySignContract from "./pages/following/AlreadySignContract";
import ErWeiMa from './pages/profile/ErWeiMa'
import Profile from "./pages/profile/Profile";
import UserSettings from "./pages/profile/UserSettings";

//已签约
import S_Main from './pages/signed/S_Main'
import S_ContactInfo from './pages/signed/S_ContactInfo'
import S_IntentionDetail from './pages/signed/S_IntentionDetail'
import S_SaleChance from './pages/signed/S_SaleChance'
import S_FollowInfo from './pages/signed/S_FollowInfo'
import S_TaskInfo from './pages/signed/S_TaskInfo'
import S_SignedContract from './pages/signed/S_AlreadySignContract'
import S_ViewerMoreContract from "./pages/signed/S_ViewerMoreContract";
import S_ContractPdf from "./pages/signed/S_ContractPdf";
import CustomerArchives from "./pages/task/CustomerArchives";
import AddSalesChance from "./pages/task/AddSalesChance";
import AddLinkPerson from "./pages/task/AddLinkPerson";
import SalesChanceDetail from "./pages/task/SalesChanceDetail";
import Exclude from "./pages/task/Exclude";
import Modal from "./components/ModalDialog";
import ApplySigned from "./pages/task/ApplySigned";
import PaymentPlan from "./pages/task/PaymentPlan";
import IntentionShielding from "./pages/task/IntentionShielding";
import LinkPersonDetail from "./pages/task/LinkPersonDetail";
import EditLinkPerson from "./pages/task/EditLinkPerson";
import TaskDetail from "./pages/task/TaskDetail";
import CancelTask from "./pages/task/CancelTask";
import AddTask from "./pages/task/AddTask";
import AccomplishTask from "./pages/task/AccomplishTask";
import DelayTask from "./pages/task/DelayTask";
import DemoUrl from "./pages/task/DemoUrl";
import CheckVerbalTrick from "./pages/task/CheckVerbalTrick";
import Province from "./pages/task/Province";
import City from "./pages/task/City";
import Area from "./pages/task/Area";
import IntentionSearch from "./pages/task/IntentionSearch";
import SearchResult from "./pages/task/SearchResult";
import ContractDetail from "./pages/task/ContractDetail";
import FollowingDetail from "./pages/task/FollowingDetail";
import AddFollowing from "./pages/task/AddFollowing";
import SelectChance from "./pages/task/SelectChance";
import ContactPersonList from "./pages/task/ContactPersonList";
import EditSalesChance from "./pages/task/EditSalesChance";
import AddElements from "./pages/task/AddElements";
import Gathering from "./pages/task/Gathering";
import UrgentToDo from "./pages/task/UrgentToDo";

const TransitionConfiguration = () => ({
    screenInterpolator: (sceneProps) => {
        const {scene} = sceneProps;
        const {route} = scene;
        // 获取屏幕切换时新屏幕的参数
        const params = route.params || {};
        // 看看参数中是否有 transition 参数，有则使用，否则使用缺省值 forHorizontal
        // forHorizontal 表示从右向左滑出
        const transition = params.transition || 'forHorizontal';
        return CardStackStyleInterpolator[transition](sceneProps);
    },
});
const AppNavigator = createStackNavigator({
        Splash: {
            screen: Splash,
        },
        Register: {
            screen: Register
        },
        Login: {
            screen: Login
        },
        Main: {
            screen: Main
        },
        TaskInfo: {
            screen: TaskInfo,
        },
        UrgentToDo:{
            screen:UrgentToDo
        },
        AddTask: {
            screen: AddTask
        },
        AccomplishTask: {
            screen: AccomplishTask
        },
        DelayTask: {
            screen: DelayTask
        },
        DemoUrl: {
            screen: DemoUrl
        },
        CheckVerbalTrick: {
            screen: CheckVerbalTrick
        },
        Province: {
            screen: Province
        },
        City: {
            screen: City
        },
        Area: {
            screen: Area
        },
        CustomerArchives: {
            screen: CustomerArchives
        },
        SelectChance: {
            screen: SelectChance
        },
        ContactPersonList: {
            screen: ContactPersonList
        },
        AddFollowing: {
            screen: AddFollowing
        },
        AddSalesChance: {
            screen: AddSalesChance
        },
        EditSalesChance: {
            screen: EditSalesChance
        },
        AddContact: {
            screen: AddLinkPerson
        },
        SalesChanceDetail: {
            screen: SalesChanceDetail
        },
        SalesChanceExclude: {
            screen: Exclude
        },
        ApplySigned: {
            screen: ApplySigned
        },
        PaymentPlan: {
            screen: PaymentPlan
        },
        IntentionShielding: {
            screen: IntentionShielding
        },
        LinkPersonDetail: {
            screen: LinkPersonDetail
        },
        EditLinkPerson: {
            screen: EditLinkPerson
        },
        TaskDetail: {
            screen: TaskDetail
        },
        SearchResult: {
            screen: SearchResult
        },
        CancelTask: {
            screen: CancelTask
        },
        Gathering: {
            screen: Gathering
        },
        Modal: {
            screen: Modal
        },
        SaleChance: {
            screen: SaleChance,
        },
        IntentionManage: {
            screen: FollowingMain
        },
        IntentionDetail: {
            screen: IntentionDetail
        },
        FollowInfo: {
            screen: FollowInfo,
        },
        ContactInfo: {
            screen: ContactInfo,
        },
        AlreadySignContract: {
            screen: AlreadySignContract
        },
        ErWeiMa: {
            screen: ErWeiMa
        },
        Profile: {
            screen: Profile,
        },
        UserSettings: {
            screen: UserSettings
        },
        S_Main: {
            screen: S_Main
        },
        S_FollowInfo: {
            screen: S_FollowInfo
        },
        S_IntentionDetail: {
            screen: S_IntentionDetail
        },
        S_ContactInfo: {
            screen: S_ContactInfo
        },
        S_SaleChance: {
            screen: S_SaleChance
        },
        S_TaskInfo: {
            screen: S_TaskInfo
        },
        S_SignedContract: {
            screen: S_SignedContract
        },
        S_ViewerMoreContract: {
            screen: S_ViewerMoreContract
        },
        S_ContractPdf: {
            screen: S_ContractPdf
        },
        ContractDetail: {
            screen: ContractDetail
        },
        AddElements: {
            screen: AddElements,
        },
        followDetail: {
            screen: FollowingDetail
        },

    },
    {
        initialRouteName: "Splash",
        headerMode: 'none',
        defaultNavigationOptions: {
            headerVisible: false
        },
        transitionConfig: () => ({ // 修改页面跳转动画方向
            screenInterpolator: CardStackStyleInterpolator.forFade,
        }),

    },
);
const defaultGetStateForAction = AppNavigator.router.getStateForAction;
AppNavigator.router.getStateForAction = (action, state) => {
    // goBack返回指定页面
    if (state && action.type === 'Navigation/BACK' && action.key) {
        const backRoute = state.routes.find((route) => route.routeName === action.key);
        if (backRoute) {
            const backRouteIndex = state.routes.indexOf(backRoute);
            const purposeState = {
                ...state,
                routes: state.routes.slice(0, backRouteIndex + 1),
                index: backRouteIndex,
            };
            return purposeState;
        }
    }
    return defaultGetStateForAction(action, state)
};
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer
