require('plugins/viz_data_country/countryTagController');
require('plugins/viz_data_country/country_tag.css');

define(function (require) {

    let CountryTagProvider = function (Private) {

        const _ = require('lodash');
        require ('kibana-plugin-lodash-oo-mixin')(_);

        const TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));
        const Schemas = Private(require('ui/Vis/schemas'));


        return new TemplateVisType({
            name: 'svd-country-tag',
            title: 'Country tag',
            description: 'cuontry importance in the search',
            icon: 'fa-cloud',
            template: require('plugins/viz_data_country/country-tag.html'),
            schemas: new Schemas([
                {
                    group: 'metrics',
                    name: 'tagsize',
                    title: 'Tagsize',
                    min: 1,
                    max: 1,
                    aggFilter: ['count']
                },
                {
                    group: 'buckets',
                    name: 'tags',
                    title: 'Tags',
                    min: 1,
                    max: 1,
                    aggFilter: 'terms'
                }
            ])
        });

    };

    require('ui/registry/vis_types').register(CountryTagProvider);
    return CountryTagProvider;
});
