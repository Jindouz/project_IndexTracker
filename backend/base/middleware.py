import nltk

class NLTKMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

        # Download NLTK data during startup
        nltk.download('vader_lexicon')

    def __call__(self, request):
        # Code to be executed for each request before the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request/response after the view is called.

        return response
    
