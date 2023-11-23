# Sandy simulation

I was inspired by
https://www.reddit.com/r/oddlysatisfying/comments/17re1dd/i_thought_it_was_satisfying_to_watch_the_hole_get/
to make a simulation of a sand pit with a comb going through it.

The initial idea that I built here uses the Havok physics engine and BabylonJS
to simulate spheres. With 1,000 spheres the simulation runs fine on my computer
and phone. With 2,000 spheres the fps goes down to 20. I suspect for a sand
simulation I would need around 100K-1M particles. So using spheres and physics
is not going to work.

For a future attempt, I might try to make the sand out of a mesh, and have the
comb modify the mesh as it goes through it.

Either that or use some sort of point particle system.

For now, see this in action at: https://ubershmekel.github.io/sand/
