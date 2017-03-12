(function ()
{
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('OrderController', OrderController);

    /** @ngInject */
    function OrderController($state, Statuses, uiGmapGoogleMapApi, Order)
    {
        var vm = this;

        // Data
        vm.order = Order.data;
        vm.statuses = Statuses.data;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [
                {
                    // Target the id column
                    targets: 0,
                    width  : '72px'
                },
                {
                    // Target the image column
                    targets   : 1,
                    filterable: false,
                    sortable  : false,
                    width     : '80px'
                },
                {
                    // Target the actions column
                    targets           : 5,
                    responsivePriority: 1,
                    filterable        : false,
                    sortable          : false
                }
            ],
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            responsive: true
        };

        vm.newStatus = '';

        // Methods
        vm.gotoOrders = gotoOrders;
        vm.gotoProductDetail = gotoProductDetail;
        vm.updateStatus = updateStatus;

        //////////

        init();

        // Normally, you would need Google Maps Geocoding API
        // to convert addresses into latitude and longitude
        // but because Google's policies, we are faking it for
        // the demo
        uiGmapGoogleMapApi.then(function (maps)
        {
            vm.shippingAddressMap = {
                center: {
                    latitude : -34.397,
                    longitude: 150.644
                },
                marker: {
                    id: 'shippingAddress'
                },
                zoom  : 8
            };

            vm.invoiceAddressMap = {
                center: {
                    latitude : -34.397,
                    longitude: 150.644
                },
                marker: {
                    id: 'invoiceAddress'
                },
                zoom  : 8
            };
        });

        /**
         * Initialize
         */
        function init()
        {
            // Select the correct order from the data.
            // This is an unnecessary step for a real world app
            // because normally, you would request the product
            // with its id and you would get only one product.
            // For demo purposes, we are grabbing the entire
            // json file which have more than one product details
            // and then hand picking the requested product from
            // it.
            var id = $state.params.id;

            for ( var i = 0; i < vm.order.length; i++ )
            {
                if ( vm.order[i].id === parseInt(id) )
                {
                    vm.order = vm.order[i];
                    break;
                }
            }
            // END - Select the correct product from the data
        }

        /**
         * Go to orders page
         */
        function gotoOrders()
        {
            $state.go('app.e-commerce.orders');
        }

        /**
         * Go to product page
         * @param id
         */
        function gotoProductDetail(id)
        {
            $state.go('app.e-commerce.products.detail', {id: id});
        }

        /**
         * Update order status
         *
         * @param id
         */
        function updateStatus(id)
        {
            if ( !id )
            {
                return;
            }

            for ( var i = 0; i < vm.statuses.length; i++ )
            {
                if ( vm.statuses[i].id === parseInt(id) )
                {
                    vm.order.status.unshift({
                        id   : vm.statuses[i].id,
                        name : vm.statuses[i].name,
                        color: vm.statuses[i].color,
                        date : moment().format('YYYY/MM/DD HH:mm:ss')
                    });

                    break;
                }
            }
        }
    }
})();