export default function updatePlayerMovement(player){
    player.vel.x = 0;
    player.vel.y = 0;

    if (player.left) {
        player.vel.x -= player.speed;
    }
    if (player.right) {
        player.vel.x += player.speed;
    }
    if (player.up) {
        player.vel.y -= player.speed;
    }
    if (player.down) {
        player.vel.y += player.speed;
    }

}