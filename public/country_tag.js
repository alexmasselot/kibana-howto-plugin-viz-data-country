require('plugins/simple_data_viz/countryTagController');
require('plugins/simple_data_viz/country_tag.css');

define(function (require) {

    let CountryTagProvider = function (Private) {

        const _ = require('lodash');
        require('./lodash-oo-mixin');

        const TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
        const Schemas = Private(require('ui/Vis/Schemas'));


        return new TemplateVisType({
            name: 'svd-country-tag',
            title: 'Country tag',
            description: 'cuontry importance in the search',
            icon: 'fa-cloud',
            template: require('plugins/simple_data_viz/country-tag.html'),
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
