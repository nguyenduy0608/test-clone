// định nghĩa router
export const routerPage = {
    // public....

    // private....
    home: '/home',
    detailbook: '/detailbook/:id',
    // work
    customer: '/customer',
    author: '/author',
    product: '/product',
    cart: '/cart',
    allbook: '/allbook/:id',
    order: '/order',
    addProduct: '/product/form',
    editProduct: '/product/form/:id',

    // garden
    garden: '/garden',
    addGarden: '/garden/form',
    editGarden: '/garden/form/:id',

    //tree
    tree: '/tree',
    addTree: '/tree/form',
    editTree: '/tree/form/:id',
    //rreport

    reportCost: '/reportcost',
    reportUseLand: '/reportuseland',
    reportHarvestCycle: '/reportharvestcycle',
    //season
    season: '/season',
    addSeason: '/season/form',
    editSeason: '/season/edit/:id',
    detailSeason: '/season/detail/:id',
    // account
    account: '/account',

    //document
    document: '/document',
    addDocument: '/document/form',
    formDocument: '/document/form/:id',

    //config
    config: 'config',
    // auth....
    login: '/auth/login',
    register: '/auth/register',

    //chat
    chat: '/chat',
    chatId: '/chat/:id/*',
    //report
    reportFlower: '/',

    //delete user
    deleteUser: '/delete-user',
};
