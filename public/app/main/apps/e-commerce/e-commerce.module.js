(function ()
{
    'use strict';

    angular
        .module('app.e-commerce',
            [
                // 3rd Party Dependencies
                'datatables',
                'flow',
                'nvd3',
                'textAngular',
                'uiGmapgoogle-maps',
                'xeditable'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.e-commerce', {
                abstract: true,
                url     : '/e-commerce'
            })
            .state('app.e-commerce.dashboard', {
                url      : '/dashboard',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/e-commerce/views/dashboard/dashboard.html',
                        controller : 'DashboardEcommerceController as vm'
                    }
                },
                resolve  : {
                    Dashboard: function (msApi)
                    {
                        return msApi.resolve('e-commerce.dashboard@get');
                    }
                },
                bodyClass: 'ecommerce'
            })
            .state('app.e-commerce.products', {
                url      : '/products',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/e-commerce/views/products/products.html',
                        controller : 'ProductsController as vm'
                    }
                },
                resolve  : {
                    Products: function (msApi)
                    {
                        return msApi.resolve('e-commerce.products@get');
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.products.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/e-commerce/views/product/product.html',
                        controller : 'ProductController as vm'
                    }
                },
                resolve  : {
                    Product: function (msApi)
                    {
                        return msApi.resolve('e-commerce.product@get');
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.orders', {
                url      : '/orders',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/e-commerce/views/orders/orders.html',
                        controller : 'OrdersController as vm'
                    }
                },
                resolve  : {
                    Orders  : function (msApi)
                    {
                        return msApi.resolve('e-commerce.orders@get');
                    },
                    Statuses: function (msApi)
                    {
                        return msApi.resolve('e-commerce.statuses@get');
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.e-commerce.orders.detail', {
                url      : '/:id',
                views    : {
                    'content@app': {
                        templateUrl: 'app/main/apps/e-commerce/views/order/order.html',
                        controller : 'OrderController as vm'
                    }
                },
                resolve  : {
                    Order   : function (msApi)
                    {
                        return msApi.resolve('e-commerce.order@get');
                    },
                    Statuses: function (msApi)
                    {
                        return msApi.resolve('e-commerce.statuses@get');
                    }
                },
                bodyClass: 'e-commerce'
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/e-commerce');

        // Api
        msApiProvider.register('e-commerce.dashboard', ['app/data/e-commerce/dashboard.json']);
        msApiProvider.register('e-commerce.products', ['app/data/e-commerce/products.json']);
        msApiProvider.register('e-commerce.product', ['app/data/e-commerce/product.json']);
        msApiProvider.register('e-commerce.orders', ['app/data/e-commerce/orders.json']);
        msApiProvider.register('e-commerce.statuses', ['app/data/e-commerce/statuses.json']);
        msApiProvider.register('e-commerce.order', ['app/data/e-commerce/order.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('apps.e-commerce', {
            title : 'E-Commerce',
            icon  : 'icon-cart',
            weight: 3
        });

        msNavigationServiceProvider.saveItem('apps.e-commerce.dashboard', {
            title: 'Dashboard',
            state: 'app.e-commerce.dashboard'
        });

        msNavigationServiceProvider.saveItem('apps.e-commerce.products', {
            title: 'Products',
            state: 'app.e-commerce.products'
        });

        msNavigationServiceProvider.saveItem('apps.e-commerce.orders', {
            title: 'Orders',
            state: 'app.e-commerce.orders'
        });
    }
})();