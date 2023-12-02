//config routes
import config from '../config';

// pages
import Home from '../Pages/Home';
import BookingInfomation from '../Pages/BookingInformation';
import Contact from '../Pages/Contact';
import Schedule from '../Pages/schedule';
import Cart from '../Pages/Cart';
import Login from '../Pages/Login';
import Register from '../Pages/Register'
import Profile from '../Pages/Profile'
import Shipping from '../Pages/Shipping'

const PublicRoute = [
    { path: config.routes.home, component: Home },
    { path: config.routes.BookingInformation, component: BookingInfomation },
    { path: config.routes.Contact, component: Contact },
    { path: config.routes.schedule, component: Schedule },
    { path: config.routes.Cart, component: Cart },
    { path: config.routes.Login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.Profile, component: Profile },
    { path: config.routes.Shipping, component: Shipping },

]

const privateRoutes = []

export { PublicRoute, privateRoutes }
