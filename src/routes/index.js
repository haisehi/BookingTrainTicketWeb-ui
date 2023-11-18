//config routes
import config from '../config';

// pages
import Home from '../Pages/Home';
import BookingInfomation from '../Pages/BookingInformation';
import ChoiceTicket from '../Pages/ChoiceTicket';
import Contact from '../Pages/Contact';
import Promotions from '../Pages/Promotions';
import Cart from '../Pages/Cart';
import Login from '../Pages/Login';
import Register from '../Pages/Register'
import Profive from '../Pages/Profive'

const PublicRoute = [
    {path:config.routes.home, component:Home},
    {path:config.routes.BookingInformation, component:BookingInfomation},
    {path:config.routes.ChoiceTicket, component:ChoiceTicket},
    {path:config.routes.Contact, component:Contact},
    {path:config.routes.Promotions, component:Promotions},
    {path:config.routes.Cart, component:Cart},
    {path:config.routes.Login, component:Login},
    {path:config.routes.register, component:Register},
    {path:config.routes.Profive, component:Profive},
]

const privateRoutes = []

export {PublicRoute,privateRoutes}
