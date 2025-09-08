// routes.ts
export interface RouteMap {
    [key: string]: string;
  }


export const PublicRoutes: RouteMap = {
  LOGIN : 'login',
  HOME: 'home',
  VIEW_PRODUCT : 'Productos/viewproduct/:id',
}

export const PrivateRoutes: RouteMap ={
    PRIVATE: 'private',
    ADMIN : 'admin',
    USER_PEDIDOS : 'UserPedidos',
    USER_VIEW_PEDIDO : 'UserPedidos/viewPedido/:id',
    ADMIN_PEDIDOS : 'Pedidos',
    ADMIN_VIEW_PEDIDO : 'Pedidos/viewPedido/:id',
    CREATE_PRODUCT : 'Productos/create',
    UPDATE_PRODUCT: 'Productos/update/:id',
    USER : 'User',
    CART : 'cart',
    VIEW_PRODUCT_PRIVATE : 'Productos/viewproduct/:id',
    FAVORITES: 'favoritos',
    DESCUENTOS: 'descuentos',

    //ver que onda con estos
    CREATE_DESCUENTO: 'descuentos/create',
    UPDATE_DESCUENTO: 'descuentos/update/:id',


    // Add more private routes as needed
    // Example:
    
    // DASHBOARD : 'dashboard',
    // PROFILE : 'profile',
    // SETTINGS : 'settings'
}

// localhost:5173/private/User