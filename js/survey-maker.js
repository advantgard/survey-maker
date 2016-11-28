(function ($) {

    "use strict";

    if(!window.appScripts) {
        window.appScripts = {};
    }

    window.appScripts.quickSurvey = function (json) {

        if(json && typeof json === "object") {
            var survey = json;
            var surveyLength = survey.questions.length;
        } else {
            throw new Error("Survey configuration is missing or invalid.");
        }

        var api = {};

        var currentQuestion = 0;
        var surveyProgress = 0;

        var $parentContainer = $(".js-quick-survey");
        var $questionsContainer = $parentContainer.children(".js-survey-container");

        var $surveyItems = null;
        var $answers = null;

        api.isSurveyOver = function () {

            return currentQuestion > surveyLength;

        };

        /**
         * Renders survey to the DOM
         */
        api.renderSurvey = function () {

            var content = "";

            $.each(survey.questions, function (index, item) {

                var question = "<h2 class='js-survey-question'>" + item.question + "</h2>";
                var answers = "<ul class='js-survey-answers'>";

                $.each(item.answers, function (index, answer) {

                    answers += "<li><a class='js-survey-answer' data-answer-index='" + index +"' href='javascript:void(0)'>" + answer + "</a></li>";

                });

                answers += "</ul>";

                content += "<li class='js-survey-item' data-item-index='" + index + "'>" + question + answers + "</li>";

            });

            $questionsContainer.append(content);

        };

        api.renderCurrentItem = function () {

            $surveyItems.removeClass("js-visible");
            $surveyItems.eq(currentQuestion).addClass("js-visible");

        };

        api.cacheSelectors = function () {

            $surveyItems = $parentContainer.find(".js-survey-item");
            $answers = $parentContainer.find(".js-survey-answer");

        };

        api.handleAnswer = function () {

            var questionIndex = $(this).parents(".js-survey-item").attr("data-item-index");

            survey.questions[questionIndex].result = $(this).attr("data-answer-index");

            surveyProgress++;
            currentQuestion++;

            api.renderCurrentItem();

        };

        api.bindEvents = function () {

            $answers.on("click", api.handleAnswer);

        };

        /**
         * Main entry point
         */
        api.init = function () {
            api.renderSurvey();
            api.cacheSelectors();
            api.bindEvents();
            api.renderCurrentItem();
        };

        return api;

    };

})(jQuery);