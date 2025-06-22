from rest_framework import serializers

class CodeExecutionSerializer(serializers.Serializer):
    code = serializers.CharField()
    language = serializers.ChoiceField(choices=[('python', 'Python'), ('cpp', 'C++'), ('javascript', 'JavaScript'), ('java', 'Java')])
    input = serializers.CharField(required=False, allow_blank=True, allow_null=True)
