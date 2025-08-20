https://github.com/HumanSignal/label-studio

nerdctl pull heartexlabs/label-studio:latest

nerdctl run -d -p 9090:8080 --name label-studio heartexlabs/label-studio:latest

nerdctl logs label-studio
