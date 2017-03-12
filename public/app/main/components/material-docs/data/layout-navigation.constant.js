angular.module('app.components.material-docs')
    .constant('LAYOUT_NAVIGATION', [
        {
            name       : 'Introduction',
            stateName  : 'material_components_layout_introduction',
            id         : 'layoutIntro',
            url        : 'layout/introduction',
            templateUrl: 'layout/layout-introduction.tmpl.html',
            weight     : 1
        },
        {
            name       : 'Layout Containers',
            stateName  : 'material_components_layout_containers',
            id         : 'layoutContainers',
            url        : 'layout/container',
            templateUrl: 'layout/layout-container.tmpl.html',
            weight     : 2
        },
        {
            name       : 'Layout Children',
            stateName  : 'material_components_layout_grid',
            id         : 'layoutGrid',
            url        : 'layout/children',
            templateUrl: 'layout/layout-children.tmpl.html',
            weight     : 3
        },
        {
            name       : 'Child Alignment',
            stateName  : 'material_components_layout_align',
            id         : 'layoutAlign',
            url        : 'layout/alignment',
            templateUrl: 'layout/layout-alignment.tmpl.html',
            weight     : 4
        },
        {
            name       : 'Extra Options',
            stateName  : 'material_components_layout_options',
            id         : 'layoutOptions',
            url        : 'layout/options',
            templateUrl: 'layout/layout-options.tmpl.html',
            weight     : 5
        },
        {
            name       : 'Troubleshooting',
            stateName  : 'material_components_layout_tips',
            id         : 'layoutTips',
            url        : 'layout/tips',
            templateUrl: 'layout/layout-tips.tmpl.html',
            weight     : 6
        }
    ]);