var LeftItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'item-container c-left scroll',
    attributes: {href : '#scrollToBottom'},

    createTemplate: _.template($('#item-template').text()),

    revealPrice: function() {
        var rendered = this.$el.append("<p class='item-price'>$ " + this.model.attributes.price + "</p> <a class='item-url' target= '_blank' href=" + this.model.attributes.url + "> VIEW ON ETSY</p>");
        rendered.hide().fadeIn('slow');
    },

    stopClickEvents: function() {
        delete this.events['click'];
        this.delegateEvents();
    },

    checkIfCorrect: function() {
        //emit click event to dispatcher so that prices reveal on both views
        dispatcher.trigger('itemViewClicked');

        // emit event to dispatcher to tell all views to kill click events
        dispatcher.trigger('tellAllStopClickEvents');

        //then actually check if user guessed correctly
        if(currentPriceLeft > currentPriceRight) {
            playerScore.attributes.correct ++;
            playerScore.trigger('change');
            dispatcher.trigger('flashAnswerCorrect');
        } else {
            playerScore.attributes.incorrect ++;
            playerScore.trigger('change');
            dispatcher.trigger('flashAnswerIncorrect');
        }

        new ShowNextPairButtonView();

        //reset smooth scrolling for new elements
        setSmoothScroll();
    },

    events: {
        'click' : 'checkIfCorrect'
    },

    initialize: function() {
        //'get back' the click event if it was lost through event delegation
        this.events = {'click' : 'checkIfCorrect'}

        //set up listens on dispatcher
        this.listenTo(dispatcher, 'tellAllStopClickEvents', this.stopClickEvents);
        this.listenTo(dispatcher, 'revealYourPrice', this.revealPrice);

        $('#main').find($('.etsyItems')).append(this.el);

        //assign the items' price to a global to be used for determing if guess is correct on click
        currentPriceLeft = parseFloat(this.model.attributes.price);
        this.render();
    },

    render: function() {
        var renderedTemplate = this.createTemplate(this.model.attributes);

        var rendered = this.$el.html(renderedTemplate);
        rendered.hide().fadeIn('slow');
    }
});