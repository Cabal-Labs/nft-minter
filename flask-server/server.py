from dataclasses import dataclass
from flask import Flask, request
import json
import warnings
import base64
from flask_cors import CORS


from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation

stability_api = client.StabilityInference(
    key='sk-k8HRyy22OcnzhHwEDI40pZNVme6F9F0Dgg5t6HC2Me78gCF5', 
    verbose=True,
)


app = Flask(__name__)
CORS(app)
# Image API Route

@app.route("/image")
def image():
    account = request.args.get('account')
    answers = stability_api.generate(
    prompt="detailed artistic paiting with futuristic," + account,
    steps=30, # defaults to 50 if not specified
    )

# iterating over the generator produces the api response
    for resp in answers:
        for artifact in resp.artifacts:
            if artifact.finish_reason == generation.FILTER:
                warnings.warn(
                    "Your request activated the API's safety filters and could not be processed."
                    "Please modify the prompt and try again.")
            if artifact.type == generation.ARTIFACT_IMAGE:
                daraStr =base64.b64encode(artifact.binary)
                base64_string = daraStr.decode('utf-8')
                return {"image":[base64_string]}



if __name__ == "__main__":
    app.run(debug=True)