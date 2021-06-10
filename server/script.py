import argparse
import bpy 
 
def get_args():
  parser = argparse.ArgumentParser()
 
  # get all script args
  _, all_arguments = parser.parse_known_args()
  double_dash_index = all_arguments.index('--')
  script_args = all_arguments[double_dash_index + 1: ]
 
  # add parser rules
  parser.add_argument('-n', '--number', help="number of cubes")
  parser.add_argument('-m', '--save', help="output file")
  parsed_script_args, _ = parser.parse_known_args(script_args)
  return parsed_script_args
 
args = get_args()
number_of_cubes = int(args.number)

# import model
bpy.ops.import_mesh.stl(filepath='./server/oriented.stl') #should be y up

if bpy.context.mode != 'OBJECT':
    bpy.ops.object.mode_set(mode='OBJECT')

bpy.ops.object.select_all(action='SELECT')
# This is to make sure that there is an active object in the scene:
#----------------------------------------------
if not bpy.context.active_object.hide_viewport:
    for object in bpy.context.scene.objects:
        if not object.hide_viewport:
            bpy.context.view_layer.objects.active = object
            break
#----------------------------------------------
bpy.ops.object.join()
bpy.ops.object.convert(target='MESH') # Here I've added an option which will
                                      # apply all modifiers by converting object
                                      # to mesh
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.object.editmode_toggle()

bpy.ops.object.mode_set(mode='EDIT')

# clear selection
bpy.ops.object.select_all(action='DESELECT')

# then select non-manifold
bpy.ops.mesh.select_non_manifold(use_boundary=False)
# then delete non manifold if any. Clear selection

bpy.ops.object.select_all(action='DESELECT')
# deselect

bpy.ops.mesh.select_non_manifold(extend=False, use_wire=False, use_boundary=True, use_multi_face=False, use_non_contiguous=False, use_verts=False)
# this is boundary edge

bpy.ops.mesh.extrude_edges_move(
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
  value=(0, 0, 20), 
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

bpy.ops.mesh.extrude_edges_move(
  MESH_OT_extrude_edges_indiv={"use_normal_flip":False, "mirror":False}, 
  TRANSFORM_OT_translate={
    "value":(0, 0, 5), 
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

bpy.ops.mesh.merge(type='CENTER')

