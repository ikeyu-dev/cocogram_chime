function doGet(e) {
    var page = e.parameter.page || "index";
    var template = HtmlService.createTemplateFromFile(page);
    return template
        .evaluate()
        .setTitle("COCOGRAM チャイム")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
