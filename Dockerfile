FROM nytimes/blender:2.92-cpu-ubuntu18.04


WORKDIR /mnt/home/ubuntu18
COPY ./server/* /mnt/home/ubuntu18/server
RUN pip install argparse 
