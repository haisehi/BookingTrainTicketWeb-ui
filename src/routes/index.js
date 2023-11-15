//config routes
import config from '../config';

// pages
import Home from '../Pages/Home';
import BookingInfomation from '../Pages/BookingInformation';
import ChoiceTicket from '../Pages/ChoiceTicket';
import Contact from '../Pages/Contact';
import Promotions from '../Pages/Promotions';
import Cart from '../Pages/Cart';

const PublicRoute = [
    {path:config.routes.home, component:Home},
    {path:config.routes.BookingInformation, component:BookingInfomation},
    {path:config.routes.ChoiceTicket, component:ChoiceTicket},
    {path:config.routes.Contact, component:Contact},
    {path:config.routes.Promotions, component:Promotions},
    {path:config.routes.Cart, component:Cart},
]

const privateRoutes = []

export {PublicRoute,privateRoutes}
