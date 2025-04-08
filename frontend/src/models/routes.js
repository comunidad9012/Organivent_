export const PublicRoutes = {
    LOGIN : 'login',
    VIEW_PRODUCT : 'Productos/viewproduct/:id',
    CREATE_CLIENT : 'createClient',
}

export const PrivateRoutes = {
    PRIVATE: 'private',
    ADMIN : 'admin',
    CREATE_PRODUCT : 'Productos/editor',
    EDIT_PRODUCT : 'Productos/edit/:id',
    USER : 'homeUser',
    CART : 'cart',
    
    // DASHBOARD : 'dashboard',
    // PROFILE : 'profile',
    // SETTINGS : 'settings'
}

// localhost:3000/private/user