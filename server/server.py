import argparse
import bpy 
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/root/server/downloads'
ALLOWED_EXTENSIONS = {'stl'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_default_context():
    window = bpy.context.window_manager.windows[0]
    return {'window': window, 'screen': window.screen}

def process_file(filename):
    
    cube = bpy.data.meshes['Cube']
    bpy.data.meshes.remove(cube)

    camera = bpy.data.objects['Camera']
    bpy.data.objects.remove(camera)

    light = bpy.data.objects['Light']
    bpy.data.objects.remove(light)


    bpy.ops.import_mesh.stl(
      filepath=os.path.join(app.config['UPLOAD_FOLDER'], filename),
      axis_up='Y') 

    if bpy.context.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')

    name_corrected = filename.split(sep=".")[0]
    if name_corrected[0].isupper()==bool(0):
        name_corrected=name_corrected[0].capitalize()

    mesh_object = bpy.context.scene.objects[name_corrected]
    print(bpy.data.meshes.keys(), mesh_object, bpy.context,  bpy.context.scene.objects.keys())
    
    bpy.ops.object.select_all(action='SELECT')

    print('selected all', bpy.context.scene.objects)

    # This is to make sure that there is an active object in the scene:
    #----------------------------------------------
    # if not bpy.context.active_object.hide_viewport:
    #     for object in bpy.context.scene.objects:
    #         if not object.hide_viewport:
    #             bpy.context.view_layer.objects.active = object
    #             break
    #----------------------------------------------
    ctx = get_default_context()
    ctx['object'] = mesh_object
    ctx['active_object'] = mesh_object
    ctx['selected_objects'] = [mesh_object]
    ctx['selected_editable_objects'] = [mesh_object]
    ctx['edit_object'] = mesh_object

    # bpy.ops.object.join()
    bpy.ops.object.convert(ctx, target='MESH') # Here I've added an option which will
                                          # apply all modifiers by converting object
                                          # to mesh
    bpy.ops.object.mode_set(ctx, mode='EDIT')
    bpy.ops.object.editmode_toggle(ctx)


    bpy.ops.object.mode_set(ctx, mode='EDIT')
    # print(ctx, ctx.object, ctx.selected_objects, ctx.selected_editable_objects )

    # print(bpy.context, ctx.editable_objects, ctx.edit_object, ctx.selected_editable_objects, ctx.mode )

    ctx['mode'] = 'EDIT_MESH'


    bpy.ops.mesh.select_all(ctx, action='SELECT')

    # clear selection
    bpy.ops.mesh.select_all(ctx, action='DESELECT')

    # then select non-manifold
    bpy.ops.mesh.select_non_manifold(ctx, se_boundary=False)
    # then delete non manifold if any. Clear selection

    bpy.ops.mesh.select_all(ctx, action='DESELECT')
    # deselect

    bpy.ops.mesh.select_non_manifold(ctx, extend=False, use_wire=False, use_boundary=True, use_multi_face=False, use_non_contiguous=False, use_verts=False)
    # this is boundary edge
    print('here')

    bpy.ops.mesh.extrude_edges_move(ctx,
      MESH_OT_extrude_edges_indiv={"use_normal_flip":False, "mirror":False}, 
      TRANSFORM_OT_translate={
        "value":(0, 0, 20), 
        "orient_type":'GLOBAL', 
        "orient_matrix":((1, 0, 0), (0, 1, 0), (0, 0, 1)), 
        "orient_matrix_type":'GLOBAL', 
        "constraint_axis":(False, False, False), 
        "mirror":False, 
        "use_proportional_edit":False, 
        "proportional_edit_falloff":'SMOOTH', 
        "proportional_size":700, 
        "use_proportional_connected":False, 
        "use_proportional_projected":False, 
        "snap":False, 
        "snap_target":'CLOSEST', 
        "snap_point":(0, 0, 0), 
        "snap_align":False, 
        "snap_normal":(0, 0, 0), 
        "gpencil_strokes":False, 
        "cursor_transform":False, 
        "texture_space":False, 
        "remove_on_cancel":False, 
        "release_confirm":False, 
        "use_accurate":False})

    #Then scale to 0 to make it flat
    bpy.ops.transform.resize(
      value=(1, 1, 0), 
      orient_type='GLOBAL', 
      orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)), 
      orient_matrix_type='GLOBAL', 
      constraint_axis=(False, False, True), 
      mirror=True, 
      use_proportional_edit=False, 
      proportional_edit_falloff='SMOOTH', 
      proportional_size=700, 
      use_proportional_connected=False, 
      use_proportional_projected=False, 
      release_confirm=True)

    bpy.ops.transform.translate(
      value=(0, 0, 10), 
      orient_type='GLOBAL', 
      orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)), 
      orient_matrix_type='GLOBAL', 
      constraint_axis=(False, False, True), 
      mirror=True, 
      use_proportional_edit=False, 
      proportional_edit_falloff='SMOOTH', 
      proportional_size=700, 
      use_proportional_connected=False, 
      use_proportional_projected=False, 
      release_confirm=True)

    bpy.ops.mesh.extrude_edges_move(ctx,
      MESH_OT_extrude_edges_indiv={"use_normal_flip":False, "mirror":False}, 
      TRANSFORM_OT_translate={
        "value":(0, 0, 2), 
        "orient_type":'GLOBAL', 
        "orient_matrix":((1, 0, 0), (0, 1, 0), (0, 0, 1)), 
        "orient_matrix_type":'GLOBAL', 
        "constraint_axis":(False, False, False), 
        "mirror":False, 
        "use_proportional_edit":False, 
        "proportional_edit_falloff":'SMOOTH', 
        "proportional_size":700, 
        "use_proportional_connected":False, 
        "use_proportional_projected":False, 
        "snap":False, 
        "snap_target":'CLOSEST', 
        "snap_point":(0, 0, 0), 
        "snap_align":False, 
        "snap_normal":(0, 0, 0), 
        "gpencil_strokes":False, 
        "cursor_transform":False, 
        "texture_space":False, 
        "remove_on_cancel":False, 
        "release_confirm":False, 
        "use_accurate":False})

    bpy.ops.mesh.merge(ctx,type='CENTER')

    # export scene
    # bpy.ops.export_scene.obj(filepath=args.save)
    print('export')
    bpy.ops.export_mesh.stl(ctx, filepath=os.path.join(app.config['UPLOAD_FOLDER'], filename, '_processed'))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            process_file(filename)
            return redirect(url_for('upload_file', name=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

app.run()
