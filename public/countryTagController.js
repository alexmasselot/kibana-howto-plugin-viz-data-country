'use strict';
var module = require('ui/modules').get('svd-country-tag');
var d3 = require('d3');
var _ = require('lodash');
var gridster = require('gridster');
var ShelfPack = require('shelf-pack');

var flagDefs = require('plugins/viz_data_country/images/flags-normal/flag-def.json');

module.controller('CountryTagController', function ($scope, $rootScope, $element, Private) {

        var filterManager = Private(require('ui/filter_manager'));

        $scope.filter = function (tag) {
            // Add a new filter via the filter manager
            filterManager.add(
                // The field to filter for, we can get it from the config
                $scope.vis.aggs.bySchemaName['tags'][0].params.field,
                // The value to filter for, we will read out the bucket key from the tag
                tag.label,
                // Whether the filter is negated. If you want to create a negated filter pass '-' here
                null,
                // The index pattern for the filter
                $scope.vis.indexPattern.title
            );
        };

        var padding = 3;

        var svg = d3.select($element[0])
            .append('svg');

        var render = function () {
            var dim = getDimension();
            svg.attr(dim);

            var tot = $scope.totalValue;

            var areaTot = dim.width * dim.height * 0.7;

            var lFlags = _.map($scope.tags, function (t) {
                var relArea = t.value / tot * areaTot;
                var flag = flagDefs[t.label.toLowerCase()];
                var alpha = relArea / (flag.width * flag.height); //don't ask me why I put *2...
                return {
                    value: t.value,
                    id: t.label,
                    width: flag.width * alpha + 2 * padding,
                    height: flag.height * alpha + 2 * padding
                };

            });

            var pack = new ShelfPack(dim.width, dim.height);
            pack.pack(lFlags, {inPlace: true});

            var sel = svg.selectAll('g.flag')
                .data(lFlags, function (t) {
                    return t.id;
                });

            //enter
            var gSel = sel.enter()
                .append('g')
                .attr('class', 'flag');

            gSel.append('rect')
                .attr('class', 'image-border');

            gSel.append('image')
                .attr({
                    'xlink:href': function (c) {
                        return '../plugins/viz_data_country/images/flags-normal/' + c.id.toLowerCase() + '.png'
                    }
                });
            gSel.append('text')
                .attr('class', 'country-count');

            //update
            sel.attr('transform',
                function (c) {
                    return 'translate(' + (c.x) + ',' + (c.y) + ')';
                });

            sel.select('rect.image-border')
                .attr({
                    x: padding - 1,
                    y: padding - 1,
                    width: function (c) {
                        return c.width - 2 * padding + 2;
                    },
                    height: function (c) {
                        return c.height - 2 * padding + 2;
                    }
                });

            sel.select('image')
                .attr({
                    x: padding,
                    y: padding,
                    width: function (c) {
                        return c.width - 2 * padding;
                    },
                    height: function (c) {
                        return c.height - 2 * padding;
                    }
                });
            sel.select('text.country-count')
                .text(function (c) {
                    return c.value;
                })
                .attr({
                    x: function (c) {
                        return c.width - 3;
                    },
                    y: function (c) {
                        return c.height - 4;
                    }
                })
                .style({
                    'font-size': function (c) {
                        return 0.25 * c.height + 'pt';
                    }
                });

            //exit
            sel.exit().remove();
        };

        var parentPanel = function () {
            return $($element).closest('div.visualize-chart');
        };

        var getDimension = function () {
            var el = parentPanel();
            return {
                height: el.height(),
                width: el.width()
            };
        };

        $scope.$watch('esResponse', function (resp) {
            if (!resp) {
                $scope.tags = [];
                return;
            }

            // Retrieve the id of the configured tags aggregation
            var tagsAggId = $scope.vis.aggs.bySchemaName['tags'][0].id;
            // Retrieve the metrics aggregation configured
            var metricsAgg = $scope.vis.aggs.bySchemaName['tagsize'][0];
            // Get the buckets of that aggregation
            var buckets = resp.aggregations[tagsAggId].buckets;


            var total = _.chain(buckets)
                .map(function (bucket) {
                    return metricsAgg.getValue(bucket);
                })
                .sum()
                .value();

            $scope.totalValue = total;

            // / Transform all buckets into tag objects
            $scope.tags = buckets.map(function (bucket) {
                // Use the getValue function of the aggregation to get the value of a bucket
                var value = metricsAgg.getValue(bucket);
                // Finding the minimum and maximum value of all buckets
                return {
                    label: bucket.key,
                    value: value
                };
            });

            render();
        });

        $rootScope.$on('change:vis', render);
    }
);

