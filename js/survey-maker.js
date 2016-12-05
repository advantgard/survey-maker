(function ($) {

    "use strict";

    if(!window.appScripts) {
        window.appScripts = {};
    }

    window.appScripts.surveyMaker = function (json, callback) {

        if(json && typeof json === "object") {
            var survey = json;
            var surveyLength = survey.questions.length - 1;
        } else {
            throw new Error("Survey configuration is missing or invalid.");
        }

        var api = {};

        var currentQuestion = 0;
        var surveyProgress = 0;
        var isComplete = false;

        var $parentContainer = $(".js-quick-survey");
        var $questionsContainer = $parentContainer.children(".js-survey-container");
        var $controlsContainer = $parentContainer.children(".js-survey-controls");
        var $next = $controlsContainer.children('.js-survey-next');
        var $prev = $controlsContainer.children('.js-survey-prev');
        var $done = $controlsContainer.children('.js-survey-done');

        var $surveyItems = null;
        var $answers = null;

        api.triggerCallback = function () {

            if(callback && typeof callback === "function") {
                callback(survey);
            } else {
                throw new Error("No callback set for survey");
            }

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

            $surveyItems.hide();
            $surveyItems.eq(currentQuestion).show();

            if(surveyProgress === 0) {
                $prev.hide();
                $next.hide();
                $done.hide();
            }

            if(currentQuestion <= 0) {
                $prev.hide();
            } else {
                $prev.show();
            }

            if(currentQuestion < surveyProgress) {
                $next.show();
            } else {
                $next.hide();
            }

            if(isComplete) {
                $done.show();
            } else {
                $done.hide();
            }

        };

        api.cacheSelectors = function () {

            $surveyItems = $parentContainer.find(".js-survey-item");
            $answers = $parentContainer.find(".js-survey-answer");

        };

        api.next = function () {
            currentQuestion++;
            api.renderCurrentItem();
        };

        api.prev = function () {
            currentQuestion--;
            api.renderCurrentItem();
        };

        api.handleAnswer = function () {

            var $this = $(this);
            var $parent = $this.parent();

            var questionIndex = $this.parents(".js-survey-item").attr("data-item-index");

            survey.questions[questionIndex].result = $this.attr("data-answer-index");
            $parent.siblings().removeClass('survey-answer-selected');
            $parent.addClass('survey-answer-selected');

            if(currentQuestion < surveyLength && currentQuestion === surveyProgress) {
                surveyProgress++;
                api.next();
            } else if (currentQuestion === surveyLength) {
                isComplete = true;
                api.renderCurrentItem();
            }

        };

        api.handleControls = function () {

            var action = $(this).attr("data-control-action");

            switch (action) {

                case "next":
                    api.next();
                    break;
                case "prev":
                    api.prev();
                    break;
                case "done":
                    api.triggerCallback();
                    break;
                default:
                    throw new Error(action + " - Control action is invalid.");
                    break;

            }

        };

        api.bindEvents = function () {

            $answers.on("click", api.handleAnswer);
            $controlsContainer.children().on("click", api.handleControls);

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