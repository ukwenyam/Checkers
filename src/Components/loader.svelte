<div id="signup-loader" class="loader-container">
    <div class="loader"></div>
</div>

<style>
    .loader-container {
        width: 100%;
        align-items: center;
        justify-content: center;
        display: flex;
        margin-top:20px;
    }

    .loader {
        width: 40px;
        height: 40px;
        border: 5px solid;
        color: #3498db;
        border-radius: 50%;
        border-top-color: transparent;
        animation: loader 1.2s linear infinite;
    }

    @keyframes loader{
        25%{
            color: #2ecc71;
        }
        50%{
            color: #f1c40f;
        }
        75%{
            color: #e74c3c;
        }
        to{
            transform: rotate(360deg);
        }
    }
</style>