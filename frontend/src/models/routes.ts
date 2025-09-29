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

    CREATE_DESCUENTO: 'descuentos/create',
    // este todavia no esta implementado
    UPDATE_DESCUENTO: 'descuentos/update/:id',
    COMPRA_FINALIZADA: 'compra-finalizada',


    // Add more private routes as needed
    // Example:
    
    // DASHBOARD : 'dashboard',
    // PROFILE : 'profile',
    // SETTINGS : 'settings'
}

// localhost:5173/private/User