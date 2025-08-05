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
    ADMIN_PEDIDOS : 'Pedidos',
    ADMIN_VIEW_PEDIDO : 'Pedidos/viewPedido/:id',
    CREATE_PRODUCT : 'Productos/create',
    UPDATE_PRODUCT: 'Productos/update/:id',
    USER : 'User',
    CART : 'cart',
    VIEW_PRODUCT_PRIVATE : 'Productos/viewproduct/:id',
    
    // DASHBOARD : 'dashboard',
    // PROFILE : 'profile',
    // SETTINGS : 'settings'
}

// localhost:5173/private/User