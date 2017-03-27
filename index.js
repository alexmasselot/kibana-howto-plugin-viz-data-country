module.exports = function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: ['plugins/viz_data_country/country_tag']
    }
  });
};
