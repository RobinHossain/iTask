(function ()
{
    'use strict';

    angular
        .module('app.e-commerce')
        .controller('OrdersController', OrdersController);

    /** @ngInject */
    function OrdersController($state, Statuses, Orders)
    {
        var vm = this;

        // Data
        vm.orders = Orders.data;
        vm.statuses = Statuses.data;

        vm.dtInstance = {};
        vm.dtOptions = {
            dom         : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs  : [
                {
                    // Target the id column
                    targets: 0,
                    width  : '72px'
                },
                {
                    // Target the status column
                    targets: 6,
                    render : function (data, type)
                    {
                        if ( type === 'display' )
                        {
                            var orderStatus = vm.getOrderStatus(data);
                            return '<span class="status ' + orderStatus.color + '">' + orderStatus.name + '</span>';
                        }

                        if ( type === 'filter' )
                        {
                            return vm.getOrderStatus(data).name;
                        }

                        return data;
                    }
                },
                {
                    // Target the actions column
                    targets           : 8,
                    responsivePriority: 1,
                    filterable        : false,
                    sortable          : false
                }
            ],
            initComplete: function ()
            {
                var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-products-search');

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    searchBox.on('keyup', function (event)
                    {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true
        };

        // Methods
        vm.getOrderStatus = getOrderStatus;
        vm.gotoOrderDetail = gotoOrderDetail;

        //////////

        /**
         * Get order status
         *
         * @param id
         * @returns {*}
         */
        function getOrderStatus(id)
        {
            for ( var i = 0; i < vm.statuses.length; i++ )
            {
                if ( vm.statuses[i].id === parseInt(id) )
                {
                    return vm.statuses[i];
                }
            }
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoOrderDetail(id)
        {
            $state.go('app.e-commerce.orders.detail', {id: id});
        }
    }
})();